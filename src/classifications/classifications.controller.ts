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
  findAll(@User() { id }: UserRequestInfo) {
    return this.classificationsService.findAll(id);
  }

  @Post()
  create(
    @Body() createClassificationDto: CreateClassificationDto,
    @User() { id }: UserRequestInfo,
  ) {
    return this.classificationsService.create(createClassificationDto, id);
  }

  @Delete(':classificationId')
  deleteOne(
    @Param('classificationId') classificationId: UniqueId,
    @User() { id }: UserRequestInfo,
  ) {
    return this.classificationsService.deleteOne(classificationId, id);
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
