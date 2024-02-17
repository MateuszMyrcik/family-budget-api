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
  findAllClassifications(@User() { householdId }: UserRequestInfo) {
    return this.classificationsService.findAllClassifications(householdId);
  }

  @Post()
  createClassification(
    @Body() createClassificationDto: CreateClassificationDto,
    @User() { householdId }: UserRequestInfo,
  ) {
    return this.classificationsService.createClassification(
      createClassificationDto,
      householdId,
    );
  }

  @Delete(':classificationId')
  deleteClassificationById(
    @Param('classificationId') classificationId: UniqueId,
    @User() { householdId }: UserRequestInfo,
  ) {
    return this.classificationsService.deleteClassificationById(
      classificationId,
      householdId,
    );
  }

  @Post(':classificationId')
  updateClassificationLabel(
    @Param('classificationId') classificationId: UniqueId,
    @Body() dto: UpdateClassificationDto,
  ) {
    return this.classificationsService.updateClassificationLabel(
      classificationId,
      dto.label,
    );
  }
}
