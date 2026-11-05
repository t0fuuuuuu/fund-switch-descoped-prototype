import { initialState } from "./mock-data";
export type UploadStatus =
  | "empty"
  | "selected"
  | "uploading"
  | "uploaded"
  | "error"
  | "error-type"
  | "error-size";
export interface UploadMetadata {
  status: UploadStatus;
  name: string;
  progress?: number;
}
export type PrototypeData = Omit<
  ReturnType<typeof initialState>,
  "documentUploads" | "additionalSourceIds" | "rpqAnswers"
> & {
  documentUploads: Record<string, UploadMetadata>;
  additionalSourceIds: string[];
  rpqAnswers: Record<string, string>;
};
export interface Holding {
  id: string;
  name: string;
  currency: string;
  type: string;
  risk: string;
  riskScore: number;
  allocation: number;
  value: number;
  switchableAllocation?: number;
  switchableValue?: number;
  navpu?: string;
  units?: string;
  accent?: string;
}

export interface SignatureState {
  image: string;
  country: string;
  city: string;
  district: string;
}
