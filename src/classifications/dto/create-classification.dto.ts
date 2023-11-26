import {
  ClassificationLabel,
  CreateClassificationRecordDto,
  UniqueId,
} from 'src/shared';

export class CreateClassificationDto implements CreateClassificationRecordDto {
  groupId: UniqueId;
  label: ClassificationLabel;
}
