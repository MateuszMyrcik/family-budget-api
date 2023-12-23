import {
  Inject,
  Injectable,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';
import { CreateClassificationDto } from './dto/create-classification.dto';

import { InjectModel } from '@nestjs/mongoose';
import {
  ClassificationRecord,
  ClassificationRecordDocument,
} from './schemas/classification-record.schema';
import { Model } from 'mongoose';
import {
  ClassificationLabel,
  DEFAULT_CLASSIFICATION_RECORDS,
  UniqueId,
} from 'src/shared';
import { DeleteResult, ObjectId } from 'mongodb';
import { HouseholdsService } from 'src/households/households.service';
import { EMPTY_CLASSIFICATION_LABELS } from './classifications.constants';

@Injectable()
export class ClassificationsService {
  constructor(
    @InjectModel(ClassificationRecord.name)
    @InjectModel('ClassificationRecord')
    private classificationRecordsModel: Model<ClassificationRecordDocument>,

    @Inject(forwardRef(() => HouseholdsService))
    private householdService: HouseholdsService,
  ) {}

  async findAll(userId: UniqueId) {
    const householdId = (await this.householdService.findOne(userId))._id;
    return this.classificationRecordsModel.find({ householdId }).exec();
  }

  async create(
    createClassificationDto: CreateClassificationDto,
    userId: UniqueId,
  ) {
    const householdId = (
      await this.householdService.findOneWithValidation(userId)
    )._id;

    const classification = await this.classificationRecordsModel.findOne({
      'group._id': createClassificationDto.groupId,
    });

    if (!classification._id) {
      throw new BadRequestException('Classification group does not exist');
    }

    const normalizedLabels = EMPTY_CLASSIFICATION_LABELS.map(
      () => createClassificationDto.label,
    );

    const createdClassification = new this.classificationRecordsModel({
      type: classification.type,
      group: classification.group,
      labels: normalizedLabels,
      householdId,
      isDeletable: true,
      isEditable: true,
    });

    return createdClassification.save();
  }

  async createDefaultClassification(householdId: ObjectId) {
    try {
      const createdRecords = await Promise.all(
        DEFAULT_CLASSIFICATION_RECORDS.map(async (record) => {
          const classificationRecord = new this.classificationRecordsModel({
            ...record,
            householdId,
          });
          return await classificationRecord.save();
        }),
      );

      return createdRecords;
    } catch (error) {
      console.error('Error creating default classification records:', error);
      throw error;
    }
  }

  async deleteUserClassification(householdId: ObjectId): Promise<DeleteResult> {
    return this.classificationRecordsModel.deleteMany({ householdId });
  }

  async deleteOne(classificationId: UniqueId): Promise<DeleteResult> {
    const id = new ObjectId(classificationId);

    return this.classificationRecordsModel.deleteOne({ _id: id });
  }

  async deleteAll(): Promise<DeleteResult> {
    return this.classificationRecordsModel.deleteMany();
  }

  async updateLabel(
    classificationId: UniqueId,
    newLabel: ClassificationLabel,
  ): Promise<any> {
    const id = new ObjectId(classificationId);
    const classification = await this.classificationRecordsModel.findById(id);

    if (!classification) {
      throw new BadRequestException('Classification does not exist');
    }

    const labels = classification.labels.map((label) => {
      if (label.lang === newLabel.lang) {
        return newLabel;
      }
      return label;
    });

    classification.labels = labels;
    return classification.save();
  }

  async getClassificationRecord(id: UniqueId): Promise<ClassificationRecord> {
    const classification = await this.classificationRecordsModel.findById(id);

    if (!classification) {
      throw new BadRequestException('Classification does not exist');
    }

    return classification;
  }
}