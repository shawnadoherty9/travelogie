import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPin, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface FilterState {
  search: string;
  location: string;
  category: string;
  type: string; // 'online' | 'offline' | 'all'
  startDate: Date | undefined;
  endDate: Date | undefined;
}

interface ExperienceFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

const ExperienceFilters = ({ filters, onFiltersChange, onClearFilters }: ExperienceFiltersProps) => {
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = filters.search || filters.location || filters.category || 
                          filters.type !== 'all' || filters.startDate || filters.endDate;

  const categories = [
    "Adventure", "Cultural", "Spiritual", "Wildlife", "Extreme Sports", 
    "Marine Life", "Aurora", "Ancient", "Temples", "Food & Drink"
  ];

  const locations = [
    "Myanmar", "France", "Indonesia", "India", "Finland", "Philippines", 
    "Nepal", "Japan", "Peru", "Morocco", "Thailand", "Iceland"
  ];

  return (
    <div className="bg-card rounded-lg border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-travel-ocean" />
          <h3 className="text-lg font-semibold">Filter Experiences</h3>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Search</label>
          <Input
            placeholder="Search experiences..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <Select value={filters.location} onValueChange={(value) => updateFilter('location', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any location</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{location}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Interest</label>
          <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any interest" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any interest</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Experience Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Experience Type</label>
          <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="offline">In-Person</SelectItem>
              <SelectItem value="online">Online</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Start Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.startDate ? format(filters.startDate, "PPP") : "Pick a start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.startDate}
                onSelect={(date) => updateFilter('startDate', date)}
                disabled={(date) => date < new Date()}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">End Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.endDate ? format(filters.endDate, "PPP") : "Pick an end date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.endDate}
                onSelect={(date) => updateFilter('endDate', date)}
                disabled={(date) => date < (filters.startDate || new Date())}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: {filters.search}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('search', '')} />
            </Badge>
          )}
          {filters.location && filters.location !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Location: {filters.location}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('location', 'all')} />
            </Badge>
          )}
          {filters.category && filters.category !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Interest: {filters.category}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('category', 'all')} />
            </Badge>
          )}
          {filters.type !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Type: {filters.type === 'offline' ? 'In-Person' : 'Online'}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('type', 'all')} />
            </Badge>
          )}
          {filters.startDate && (
            <Badge variant="secondary" className="gap-1">
              From: {format(filters.startDate, "MMM dd")}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('startDate', undefined)} />
            </Badge>
          )}
          {filters.endDate && (
            <Badge variant="secondary" className="gap-1">
              To: {format(filters.endDate, "MMM dd")}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('endDate', undefined)} />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default ExperienceFilters;