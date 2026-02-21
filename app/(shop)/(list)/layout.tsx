import { getFilters } from "@/app/services/filters";
import { SearchInput } from "../components/filters/search/search";
import { FiltersSidebar } from "../components/filters/filters";
import { Banner } from "../components/banner";
import { FiltersUIProvider } from "../providers/filters-ui"; 
import { Sort } from "../components/filters/sort";

export default async function CategoryListLayout({ children }: { children: React.ReactNode }) {
  const filters = await getFilters();

  return (
    <FiltersUIProvider>
      {/* Filters */}
        <FiltersSidebar availableFilters={filters}/>
        {/* Banner */}
      <Banner name="Ver todo" image="/shop/background.png" /> 
      <div className="container mx-auto px-4">
          {/* Products */}
          <main>
            {/* Sort to show the filters */}
            <Sort/>
            
            {children}
          </main>         
      </div>
    </FiltersUIProvider>
  );
}