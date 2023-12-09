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
import { UserRequestInfo } from '../common/user.type';
import { UniqueId } from 'src/shared/commonTypes';
import { CreateCyclicTransactionDto } from './dto/create-cyclic-transaction.dto';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

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

  @Get()
  getUserTransactions(@User() { id }: UserRequestInfo) {
    return this.transactionsService.getUserTransactions(id);
  }

  @Get(':id')
  getUserTransaction(@Param('id') id: UniqueId) {
    return this.transactionsService.getUserTransaction(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: UniqueId,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.updateTransaction(id, updateTransactionDto);
  }

  @Delete()
  resetAll() {
    return this.transactionsService.resetAll();
  }

  @Delete(':transactionId')
  removeTransaction(@Param('transactionId') transactionId: UniqueId) {
    return this.transactionsService.removeTransaction(transactionId);
  }
}
