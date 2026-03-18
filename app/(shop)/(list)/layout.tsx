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
        {/* Banner */}
      <Banner name="Ver todo" image="/shop/background.png" /> 
      <div className=" bg-beige">
          {/* Products */}
          <main className="container mx-auto px-4">
            {/* Sort to show the filters */}
            <Suspense fallback={<div className="h-14" />}>
              <Sort/>
            </Suspense>
            
            {children}
          </main>         
      </div>
    </FiltersUIProvider>
  );
}