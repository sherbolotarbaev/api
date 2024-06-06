export interface IHunterResponse {
  data: {
    readonly status: string;
    readonly result: string;
    readonly _deprecation_notice: string;
    readonly score: number;
    readonly email: string;
    readonly regexp: boolean;
    readonly gibberish: boolean;
    readonly disposable: boolean;
    readonly webmail: boolean;
    readonly mx_records: boolean;
    readonly smtp_server: boolean;
    readonly smtp_check: boolean;
    readonly accept_all: boolean;
    readonly block: boolean;
    readonly sources: string[];
  };
}
