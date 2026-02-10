import { getFilters } from "@/app/services/filters";
import { SearchInput } from "../components/search";
import { FiltersSidebar } from "../components/filters";


export default async function CategoryListLayout({ children }: { children: React.ReactNode }) {
  const filters = await getFilters();

  return (
    <div className="container mx-auto px-4">

      <div className="grid grid-cols-[260px_1fr] gap-6">


        {/* Filters */}
        <aside>
          <SearchInput />
          <FiltersSidebar availableFilters={filters}/>
        </aside>

        {/* Products */}
        <main>
          {children}
        </main>

      </div>

    </div>
  );
}