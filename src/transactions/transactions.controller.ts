import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PayTransactionDto } from './dto/pay-transaction.dto';
import { TransactionsService } from './transactions.service';

/**
 * TransactionsController defines the HTTP routes for creating
 * transactions, paying them via Wompi and retrieving their state.
 */
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * Create a new transaction with status=PENDING.  The amount is
   * calculated on the server based on the product prices and
   * quantities supplied.  Returns a transactionId to be used for
   * subsequent operations.
   */
  @Post()
  async create(@Body() dto: CreateTransactionDto) {
    return this.transactionsService.createTransaction(dto);
  }

  /**
   * Pay a transaction using the supplied payment method.  The id
   * parameter is taken from the route.  Returns the updated
   * transaction state and includes the raw Wompi response.
   */
  @Post(':id/pay')
  async pay(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PayTransactionDto,
  ) {
    return this.transactionsService.payTransaction(id, dto);
  }

  /**
   * Retrieve a transaction by its id.  Includes the items and their
   * quantities and the current status.  If the transaction does not
   * exist a 404 is returned.
   */
  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.getTransaction(id);
  }
}