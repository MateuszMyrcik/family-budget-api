import {
  CLASSIFICATION_SUPPORT_LANGUAGES,
  CLASSIFICATION_TYPES,
} from '../constants';

export type ClassificationType = typeof CLASSIFICATION_TYPES[number];

export type ClassificationSupportedLanguage =
  typeof CLASSIFICATION_SUPPORT_LANGUAGES[number];

export type ClassificationLabel = {
  lang: ClassificationSupportedLanguage;
  value: string;
};

export type ClassificationRecord = {
  _id: string;
  type: ClassificationType;
  labels: ClassificationLabel[];
  group: ClassificationGroup;
  householdId: string;
  isDeletable: boolean;
  isEditable: boolean;
};

export type ClassificationGroup = {
  _id: string;
  label: ClassificationLabel[];
  decorationColor: string;
};

export type CreateClassificationRecordDto = {
  label: ClassificationLabel;
  groupId: string;
};

export type UpdateClassificationRecordDto = {
  label: ClassificationLabel;
};
