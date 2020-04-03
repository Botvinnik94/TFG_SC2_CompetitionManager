export interface IRound {

    matches: string[];
    status: "pending" | "ongoing" | "completed";
    startedAt: number | null;
    finishedAt: number | null;

}