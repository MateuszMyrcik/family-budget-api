import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserRequestInfo } from 'src/common/user.type';
import { User } from 'src/common/user.decorator';
import { UpdateBudgetRecordDto } from './dto/update-budget-record.dto';

@Controller('budgets')
@UseGuards(AuthGuard('jwt'))
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  createBudget(@Body() dto: CreateBudgetDto, @User() { id }: UserRequestInfo) {
    return this.budgetsService.createBudget(dto, id);
  }

  @Get('/:month/:year')
  getPeriodicBudgetRecords(
    @Param('month') month: number,
    @Param('year') year: number,
    @User() { id }: UserRequestInfo,
  ) {
    return this.budgetsService.getPeriodicBudgetRecords({ month, year }, id);
  }

  @Post('/records')
  updateBudgetRecord(
    @Body() dto: UpdateBudgetRecordDto,
    @User() { id }: UserRequestInfo,
  ) {
    return this.budgetsService.updateBudgetRecord(dto, id);
  }

  @Delete()
  deleteHouseholdBudget(@User() { id }: UserRequestInfo) {
    return this.budgetsService.deleteHouseholdBudget(id);
  }
}
