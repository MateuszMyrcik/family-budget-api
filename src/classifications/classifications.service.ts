import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateClassificationDto } from './dto/create-classification.dto';

import { InjectModel } from '@nestjs/mongoose';
import {
  ClassificationRecord,
  ClassificationRecordDocument,
} from './schemas/classification-record.schema';
import { ClassificationRecord as ClassificationRecordType } from 'src/shared';
import { Model } from 'mongoose';
import {
  ClassificationLabel,
  DEFAULT_CLASSIFICATION_RECORDS,
  UniqueId,
} from 'src/shared';
import { DeleteResult, ObjectId } from 'mongodb';
import { EMPTY_CLASSIFICATION_LABELS } from './classifications.constants';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ClassificationsService {
  constructor(
    @InjectModel(ClassificationRecord.name)
    @InjectModel('ClassificationRecord')
    private classificationRecordsModel: Model<ClassificationRecordDocument>,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAllClassifications(householdId: ObjectId) {
    return this.classificationRecordsModel.find({ householdId }).exec();
  }

  async createClassification(
    createClassificationDto: CreateClassificationDto,
    householdId: ObjectId,
  ) {
    if (!Object.keys(createClassificationDto).length) {
      throw new BadRequestException('Classification data is required');
    }

    const classification = await this.classificationRecordsModel.findOne({
      'group._id': createClassificationDto.groupId,
    });

    if (!classification || !classification._id) {
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

    this.eventEmitter.emit(
      'classification.created',
      createdClassification._id,
      householdId,
    );

    return createdClassification.save();
  }

  @OnEvent('household.created')
  async onHouseholdCreate(householdId: ObjectId) {
    await this.createDefault(householdId);
  }

  async createDefault(householdId: ObjectId) {
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
      throw error;
    }
  }

  @OnEvent('household.deleted')
  async onHouseholdDelete(householdId: ObjectId) {
    await this.deleteClassification(householdId);
  }

  async deleteClassification(householdId: ObjectId): Promise<DeleteResult> {
    return this.classificationRecordsModel.deleteMany({ householdId });
  }

  async getClassifications(
    householdId: ObjectId,
  ): Promise<ClassificationRecordType[]> {
    return this.classificationRecordsModel.find({ householdId });
  }

  async findClassificationById(id: UniqueId): Promise<ClassificationRecord> {
    const classification = await this.classificationRecordsModel.findById(id);

    if (!classification) {
      throw new BadRequestException('Classification does not exist');
    }

    return classification;
  }

  async deleteClassificationById(
    classificationId: UniqueId,
    householdId: ObjectId,
  ): Promise<DeleteResult> {
    const clarificationId = new ObjectId(classificationId);
    const classification = await this.classificationRecordsModel.findById(
      clarificationId,
    );

    if (!classification.isDeletable) {
      throw new BadRequestException('Classification is not deletable');
    }

    await this.classificationRecordsModel.deleteOne({ _id: clarificationId });

    this.eventEmitter.emit(
      'classification.deleted',
      clarificationId,
      householdId,
    );

    return;
  }

  async updateClassificationLabel(
    classificationId: UniqueId,
    newLabel: ClassificationLabel,
  ): Promise<any> {
    if (!classificationId || !newLabel || !newLabel.lang || !newLabel.value) {
      throw new BadRequestException('Classification data is required');
    }

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

  async getClassification(id: UniqueId): Promise<ClassificationRecord> {
    const classification = await this.classificationRecordsModel.findById(id);

    if (!classification) {
      throw new BadRequestException('Classification does not exist');
    }

    return classification;
  }
}
