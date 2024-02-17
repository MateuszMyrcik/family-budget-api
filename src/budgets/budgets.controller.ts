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
  createBudget(
    @Body() dto: CreateBudgetDto,
    @User() { id, householdId }: UserRequestInfo,
  ) {
    return this.budgetsService.createBudget(dto, id, householdId);
  }

  @Get('/:month/:year')
  getPeriodicBudgetRecords(
    @Param('month') month: number,
    @Param('year') year: number,
    @User() { householdId }: UserRequestInfo,
  ) {
    return this.budgetsService.getBudgetRecordsForPeriod(
      { month, year },
      householdId,
    );
  }

  @Post('/records')
  addBudgetRecord(
    @Body() dto: UpdateBudgetRecordDto,
    @User() { householdId }: UserRequestInfo,
  ) {
    return this.budgetsService.addBudgetRecord(dto, householdId);
  }

  @Delete()
  deleteHouseholdBudget(@User() { householdId }: UserRequestInfo) {
    return this.budgetsService.deleteBudgetById(householdId);
  }
}
