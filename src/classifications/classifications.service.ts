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

  async findAll(householdId: ObjectId) {
    return this.classificationRecordsModel.find({ householdId }).exec();
  }

  async create(
    createClassificationDto: CreateClassificationDto,
    householdId: ObjectId,
  ) {
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

    this.eventEmitter.emit(
      'classification.created',
      createdClassification._id,
      householdId,
    );

    return createdClassification.save();
  }

  @OnEvent('household.created')
  async handleHouseholdCreatedEvent(householdId: ObjectId) {
    await this.createDefaultClassification(householdId);
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
      throw error;
    }
  }

  @OnEvent('household.deleted')
  async handleHouseholdDeletedEvent(householdId: ObjectId) {
    await this.deleteHouseholdClassificationRecords(householdId);
  }

  async deleteHouseholdClassificationRecords(
    householdId: ObjectId,
  ): Promise<DeleteResult> {
    return this.classificationRecordsModel.deleteMany({ householdId });
  }

  async getUserClassifications(
    householdId: ObjectId,
  ): Promise<ClassificationRecordType[]> {
    return this.classificationRecordsModel.find({ householdId });
  }

  async findOne(id: UniqueId): Promise<ClassificationRecord> {
    const classification = await this.classificationRecordsModel.findById(id);

    if (!classification) {
      throw new BadRequestException('Classification does not exist');
    }

    return classification;
  }

  async deleteOne(
    classificationId: UniqueId,
    householdId: ObjectId,
  ): Promise<DeleteResult> {
    const clarificationId = new ObjectId(classificationId);

    this.eventEmitter.emit(
      'classification.deleted',
      clarificationId,
      householdId,
    );

    return this.classificationRecordsModel.deleteOne({ _id: clarificationId });
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
