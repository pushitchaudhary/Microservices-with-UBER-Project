// export interface AuthenticatedRequest extends Express.Request {
//   headers: any;
//   user?: {
//       split(arg0: string): unknown;
//       startsWith(arg0: string): unknown; userId: string; email: string 
// };
// }

export interface AuthenticatedRequest extends Express.Request {
  headers: Record<string, string | string[]> & {
    authorization?: string;
  };
  user?: { userId: string; email: string };
}