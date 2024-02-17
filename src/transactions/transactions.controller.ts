import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../common/user.decorator';
import { UniqueId } from 'src/shared/commonTypes';
import { CreateCyclicTransactionDto } from './dto/create-cyclic-transaction.dto';

import { UserRequestInfo } from 'src/common/user.type';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  getTransactions(@User() { householdId }: UserRequestInfo) {
    return this.transactionsService.getTransactions(householdId);
  }
  @Post()
  createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.createTransaction(createTransactionDto);
  }

  @Post('/cyclic')
  createCyclicTransaction(
    @Body() createCyclicTransactionDto: CreateCyclicTransactionDto,
  ) {
    return this.transactionsService.createCyclicTransaction(
      createCyclicTransactionDto,
    );
  }

  @Get(':id')
  getTransactionById(@Param('id') id: UniqueId) {
    return this.transactionsService.getTransactionById(id);
  }

  @Patch(':id')
  updateTransactionById(
    @Param('id') id: UniqueId,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.updateTransactionById(
      id,
      updateTransactionDto,
    );
  }

  @Delete(':transactionId')
  deleteTransaction(@Param('transactionId') transactionId: UniqueId) {
    return this.transactionsService.deleteTransaction(transactionId);
  }
}
