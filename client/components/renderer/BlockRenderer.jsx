import { motion } from 'framer-motion';
import OverviewBlock from './OverviewBlock.jsx';
import TimelineBlock from './TimelineBlock.jsx';
import BudgetBlock from './BudgetBlock.jsx';
import ChecklistBlock from './ChecklistBlock.jsx';
import RestaurantsBlock from './RestaurantsBlock.jsx';
import WeatherBlock from './WeatherBlock.jsx';
import TipsBlock from './TipsBlock.jsx';
import WarningsBlock from './WarningsBlock.jsx';
import FallbackBlock from './FallbackBlock.jsx';

const BLOCK_MAP = {
  overview: OverviewBlock,
  timeline: TimelineBlock,
  budget: BudgetBlock,
  checklist: ChecklistBlock,
  restaurants: RestaurantsBlock,
  weather: WeatherBlock,
  tips: TipsBlock,
  warnings: WarningsBlock,
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

export default function BlockRenderer({ blocks = [], onUpdateBlock }) {
  if (!blocks.length) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {blocks.map((block, index) => {
        const Component = BLOCK_MAP[block?.type] || FallbackBlock;
        return (
          <motion.div key={block?.type || index} variants={itemVariants}>
            <Component block={block} onUpdate={onUpdateBlock} />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
