import { ReactComponent as Blue } from './blue.svg';
import { ReactComponent as BluePurple } from './blue-purple.svg';
import { ReactComponent as Green } from './green.svg';
import { ReactComponent as LightPurple } from './light-purple.svg';
import { ReactComponent as LightRed } from './light-red.svg';
import { ReactComponent as Moss } from './moss.svg';
import { ReactComponent as Mustard } from './mustard.svg';
import { ReactComponent as Orange } from './orange.svg';
import { ReactComponent as Pea } from './pea.svg';
import { ReactComponent as Pink } from './pink.svg';
import { ReactComponent as Purple } from './purple.svg';
import { ReactComponent as Red } from './red.svg';
import { ReactComponent as Teal } from './teal.svg';
import { ReactComponent as Yellow } from './yellow.svg';

interface PathComponents {
  [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

const Paths: PathComponents = {
  Blue,
  BluePurple,
  Green,
  LightPurple,
  LightRed,
  Moss,
  Mustard,
  Orange,
  Pea,
  Pink,
  Purple,
  Red,
  Teal,
  Yellow,
};

export default Paths;
