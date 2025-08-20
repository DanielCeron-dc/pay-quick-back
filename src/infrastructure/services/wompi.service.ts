import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { createHash } from 'crypto';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionStatus } from '../../domain/entities/transaction.entity';

/**
 * Service responsible for interacting with the external Wompi API.
 * It encapsulates the details of obtaining acceptance tokens,
 * computing integrity signatures and sending transaction requests.
 *
 * The service caches the acceptance token to avoid unnecessary
 * network calls.  It throws descriptive errors if required
 * environment variables are missing or if the Wompi API returns
 * unexpected responses.
 */
@Injectable()
export class WompiService {
  /**
   * Wompi treats acceptance tokens as single‑use.  We therefore do not cache
   * tokens here.  A fresh token is fetched on every call to
   * `getAcceptanceToken()`.  For reference, Wompi’s documentation
   * explains that two acceptance tokens (`acceptance_token` and
   * `accept_personal_auth`) must be provided in the body of each
   * transaction or payment source request【914060858404748†L85-L97】.
   */
  private cachedAcceptanceToken: null = null;

  constructor(private readonly httpService: HttpService) {}

  /**
   * Retrieves a presigned acceptance token from the Wompi API and
   * caches it for 15 minutes.  Requires the public key to be
   * provided via the WOMPI_PUBLIC_KEY environment variable.
   */
  async getAcceptanceToken(): Promise<string> {
    const publicKey = process.env.WOMPI_PUBLIC_KEY;
    const baseUrl = process.env.WOMPI_UAT_SANDBOX_URL || 'https://api-sandbox.co.uat.wompi.dev/v1';
    if (!publicKey) {
      throw new Error('WOMPI_PUBLIC_KEY environment variable is not set');
    }
    const response = await this.httpService.axiosRef.get(`${baseUrl}/merchants/${publicKey}`);
    const json = response?.data;
    const token = json?.data?.presigned_acceptance?.acceptance_token;
    if (!token) {
      throw new Error('Acceptance token not present in Wompi response');
    }
    return token;
  }

  /**
   * Retrieves both acceptance tokens (privacy policy and personal data auth)
   * from Wompi.  This method is useful when you need to send both
   * `acceptance_token` and `accept_personal_auth` in the body of the request.
   * It fetches a fresh set of tokens on every call.
   */
  async getAcceptanceTokens(): Promise<{ acceptanceToken: string; acceptPersonalAuth: string }> {
    const publicKey = process.env.WOMPI_PUBLIC_KEY;
    const baseUrl = process.env.WOMPI_UAT_SANDBOX_URL || 'https://api-sandbox.co.uat.wompi.dev/v1';
    if (!publicKey) {
      throw new Error('WOMPI_PUBLIC_KEY environment variable is not set');
    }
    const response = await this.httpService.axiosRef.get(`${baseUrl}/merchants/${publicKey}`);
    const json = response?.data;
    const acceptanceToken = json?.data?.presigned_acceptance?.acceptance_token;
    const personalToken = json?.data?.presigned_personal_data_auth?.acceptance_token;
    if (!acceptanceToken || !personalToken) {
      throw new Error('Acceptance tokens not present in Wompi response');
    }
    return { acceptanceToken, acceptPersonalAuth: personalToken };
  }

  /**
   * Calls the Wompi transaction endpoint to process a payment.  It
   * computes the integrity signature required by Wompi based on
   * the transaction data and the WOMPI_INTEGRITY_KEY environment
   * variable.
   *
   * Returns the mapped TransactionStatus and the full Wompi response.
   */
  async processPayment(
    transaction: Transaction,
    paymentMethod: { type: string; token: string; installments?: number },
  ): Promise<{ status: TransactionStatus; wompi: any; reference: string }> {
    // Retrieve fresh acceptance tokens (privacy policy and personal data auth)
    const { acceptanceToken, acceptPersonalAuth } = await this.getAcceptanceTokens();
    const baseUrl = process.env.WOMPI_UAT_SANDBOX_URL || 'https://api-sandbox.co.uat.wompi.dev/v1';
    const privateKey = process.env.WOMPI_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('WOMPI_PRIVATE_KEY environment variable is not set');
    }
    const integrityKey = process.env.WOMPI_INTEGRITY_KEY;
    if (!integrityKey) {
      throw new Error('WOMPI_INTEGRITY_KEY environment variable is not set');
    }
    const reference = `TX_${transaction.id}_${Date.now()}`;
    // Compute signature: reference + amount + currency + integrityKey
    const signatureString = `${reference}${transaction.amountInCents}${transaction.currency}${integrityKey}`;
    const signature = createHash('sha256').update(signatureString).digest('hex');
    const wompiPayload = {
      amount_in_cents: transaction.amountInCents,
      currency: transaction.currency,
      customer_email: transaction.customerEmail,
      payment_method: paymentMethod,
      reference,
      acceptance_token: acceptanceToken,
      accept_personal_auth: acceptPersonalAuth,
      signature,
    };
    let wompiJson: any = null;
    try {
      const wompiRes = await this.httpService.axiosRef.post(`${baseUrl}/transactions`, wompiPayload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${privateKey}`,
        },
      });
      wompiJson = wompiRes?.data;
    } catch (error: any) {
      // If the request fails (e.g. validation error), capture the error response
      wompiJson = error?.response?.data ?? null;
    }
    const wompiStatus = wompiJson?.data?.status ?? wompiJson?.status ?? null;
    // Map Wompi status to our domain status
    let newStatus: TransactionStatus = TransactionStatus.DECLINED;
    if (wompiStatus === 'APPROVED' || wompiStatus === 'VERIFIED' || wompiStatus === 'AUTHORIZED' || wompiStatus === 'PENDING') {
      newStatus = TransactionStatus.APPROVED;
    } else {
      newStatus = TransactionStatus.DECLINED;
    }
    return { status: newStatus, wompi: wompiJson, reference };
  }
}