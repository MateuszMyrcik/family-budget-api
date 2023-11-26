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

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  findAll(@User() { id }: UserRequestInfo) {
    return this.transactionsService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: UniqueId) {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: UniqueId,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: UniqueId) {
    return this.transactionsService.remove(id);
  }

  @Delete()
  resetAll() {
    return this.transactionsService.resetAll();
  }
}
