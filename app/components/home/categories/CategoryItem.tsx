import type { Category } from '@/types/category';

interface CategoryItemProps {
  category: Category;
}

function CategoryItem({ category }: CategoryItemProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-4">
      <h3 className="font-semibold text-dark">{category.name}</h3>
      {category.slug && (
        <span className="text-muted text-sm">{category.slug}</span>
      )}
    </div>
  );
}

export default CategoryItem;
