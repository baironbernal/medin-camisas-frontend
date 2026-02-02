'use client';

import Link from "next/link";
import { Category } from "@/types/category";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface RecursiveCategoryItemProps {
  category: Category;
  level?: number;
}

export default function RecursiveCategoryItem({ 
  category, 
  level = 0 
}: RecursiveCategoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const hasChildren = category.children_recursive && category.children_recursive.length > 0;
  const href = category.slug ? `/categoria/${category.slug}` : "#";

  return (
    <div className={`${level > 0 ? 'ml-4 mt-2' : ''}`}>
      <div className="flex items-start gap-2">
        {/* Expand/Collapse Button */}
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-1 transition-transform duration-200 hover:text-accent"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            <ChevronDown 
              size={16} 
              className={`
                transition-transform 
                duration-300
                ${isExpanded ? 'rotate-180' : 'rotate-0'}
              `}
            />
          </button>
        )}
        
        {/* Category Link */}
        <Link
          href={href}
          className={`
            block
            font-medium
            transition-all
            duration-200
            hover:text-accent
            hover:translate-x-1
            ${level === 0 ? 'text-base' : 'text-sm'}
            ${!hasChildren ? 'ml-6' : ''}
          `}
        >
          {category.name}
        </Link>
      </div>

      {/* Recursive Children */}
      {hasChildren && isExpanded && (
        <div 
          className="
            animate__animated 
            animate__fadeIn 
            animate__faster
            border-l-2
            border-white/10
            ml-2
          "
          style={{
            animationDuration: '0.3s'
          }}
        >
          {category.children_recursive!.map((child) => (
            <RecursiveCategoryItem 
              key={child.id} 
              category={child} 
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
