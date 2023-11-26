import { ClassificationLabel, UpdateClassificationRecordDto } from 'src/shared';

export class UpdateClassificationDto implements UpdateClassificationRecordDto {
  label: ClassificationLabel;
}
