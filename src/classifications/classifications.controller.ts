import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClassificationsService } from './classifications.service';
import { CreateClassificationDto } from './dto/create-classification.dto';
import { User } from 'src/common/user.decorator';
import { UserRequestInfo } from 'src/common/user.type';
import { AuthGuard } from '@nestjs/passport';
import { UniqueId } from 'src/shared';
import { UpdateClassificationDto } from './dto/update-classification.dto';

@Controller('classifications')
@UseGuards(AuthGuard('jwt'))
export class ClassificationsController {
  constructor(
    private readonly classificationsService: ClassificationsService,
  ) {}

  @Get()
  findAll(@User() { householdId }: UserRequestInfo) {
    return this.classificationsService.findAll(householdId);
  }

  @Post()
  create(
    @Body() createClassificationDto: CreateClassificationDto,
    @User() { householdId }: UserRequestInfo,
  ) {
    return this.classificationsService.create(
      createClassificationDto,
      householdId,
    );
  }

  @Delete(':classificationId')
  deleteOne(
    @Param('classificationId') classificationId: UniqueId,
    @User() { householdId }: UserRequestInfo,
  ) {
    return this.classificationsService.deleteOne(classificationId, householdId);
  }

  @Delete()
  deleteAll() {
    return this.classificationsService.deleteAll();
  }

  @Post(':classificationId')
  addLabel(
    @Param('classificationId') classificationId: UniqueId,
    @Body() dto: UpdateClassificationDto,
  ) {
    return this.classificationsService.updateLabel(classificationId, dto.label);
  }
}
