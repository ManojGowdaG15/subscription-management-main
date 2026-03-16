import { categories } from '../services/api';

const ContentFilter = ({ selected, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 py-4">
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`px-4 py-2 rounded-full transition ${
            selected === category.id
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <span className="flex items-center space-x-1">
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </span>
        </button>
      ))}
    </div>
  );
};

export default ContentFilter;