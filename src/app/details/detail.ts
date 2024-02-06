export class FormDataModel {
  Student_id!: number;
  Name!: string;
  Father_Name!: string;
  Date_of_Birth!: number;
  Gender!: boolean;
  Nrc_Exists!: boolean;
  Nrc!: string;
  SchoolYear!: string;
  Myanmar!: number;
  English!: number;
  Mathematics!: number;
  Physics!: number;
  Chemistry!: number;
  Bio_Eco!: number;
  totalMarks!: number;
  result!: string;
  Total!: number;
  Result!: boolean;
  id!: number;
  exam_results!: {
    id: number;
    SchoolYear: string;
    Myanmar: number;
    English: number;
    Mathematics: number;
    Physics: number;
    Chemistry: number;
    Bio_Eco: number;
    Total: number;
    Result: boolean;
  }[];
}
