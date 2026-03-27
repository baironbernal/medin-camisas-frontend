import { getFilters } from "@/app/services/filters";
import { FiltersSidebar, Banner, Sort } from "../components";
import { FiltersUIProvider } from "../useContext/FiltersContext"; 
import { Suspense } from "react";


export default async function CategoryListLayout({ children }: { children: React.ReactNode }) {
  const filters = await getFilters();

  return (
    <FiltersUIProvider>
      {/* Filters */}
      <Suspense fallback={null}>
        <FiltersSidebar availableFilters={filters}/>
      </Suspense>
        
      <div className=" bg-beige">
        {children}
      </div>
    </FiltersUIProvider>
  );
}