export interface JsonLogEntry {
    queryTime: string;
    queryTimeString: string;
    entityCall: unknown | null;
    methodCall: unknown | null;
    entity: unknown | null;
    message: string | null;
    errorName: string | null;
    errorMessage: string | null;
    affectedRows: number | null;
}