export interface IRouteProps {
  path: string;
  element?: React.ReactNode;
  name?: string;
  index?: boolean;
  children?: IRouteProps[];
}
