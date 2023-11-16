export class CreateHouseholdDto {
  public name?: string;
  public ownerId: string;
  public membersIds: string[];
}
