import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  MapPin, 
  Globe, 
  Search, 
  Filter, 
  X,
  Compass,
  Calendar,
  Users,
  Heart,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ExploreFilters, LocationSourceType } from '@/hooks/useExploreLocations';

interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
}

interface InterestTag {
  id: string;
  name: string;
  category: string | null;
  icon: string | null;
}

interface ExploreMapFiltersProps {
  filters: ExploreFilters;
  categories: Category[];
  interestTags: InterestTag[];
  onFiltersChange: (filters: Partial<ExploreFilters>) => void;
  onNearMeClick: () => void;
  onExploreClick: () => void;
  isNearMeMode: boolean;
  userLocation: { latitude: number; longitude: number } | null;
  locationCount: number;
  loading: boolean;
}

const SOURCE_TYPE_CONFIG: Record<LocationSourceType, { label: string; icon: React.ReactNode; color: string }> = {
  activities: { label: 'Activities', icon: <Compass className="w-4 h-4" />, color: 'bg-blue-500' },
  events: { label: 'Events', icon: <Calendar className="w-4 h-4" />, color: 'bg-green-500' },
  tour_operators: { label: 'Tour Guides', icon: <Users className="w-4 h-4" />, color: 'bg-orange-500' },
  user_suggestions: { label: 'User Tips', icon: <Heart className="w-4 h-4" />, color: 'bg-red-500' },
  osm_places: { label: 'Heritage Sites', icon: <MapPin className="w-4 h-4" />, color: 'bg-purple-500' },
};

export const ExploreMapFilters: React.FC<ExploreMapFiltersProps> = ({
  filters,
  categories,
  interestTags,
  onFiltersChange,
  onNearMeClick,
  onExploreClick,
  isNearMeMode,
  userLocation,
  locationCount,
  loading,
}) => {
  const [categoriesOpen, setCategoriesOpen] = React.useState(false);
  const [interestsOpen, setInterestsOpen] = React.useState(false);

  const toggleSourceType = (sourceType: LocationSourceType) => {
    const newSourceTypes = filters.sourceTypes.includes(sourceType)
      ? filters.sourceTypes.filter(t => t !== sourceType)
      : [...filters.sourceTypes, sourceType];
    onFiltersChange({ sourceTypes: newSourceTypes });
  };

  const toggleCategory = (categoryId: string) => {
    const newCategories = filters.categoryIds.includes(categoryId)
      ? filters.categoryIds.filter(id => id !== categoryId)
      : [...filters.categoryIds, categoryId];
    onFiltersChange({ categoryIds: newCategories });
  };

  const toggleInterestTag = (tagId: string) => {
    const newTags = filters.interestTagIds.includes(tagId)
      ? filters.interestTagIds.filter(id => id !== tagId)
      : [...filters.interestTagIds, tagId];
    onFiltersChange({ interestTagIds: newTags });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      sourceTypes: ['activities', 'events', 'tour_operators', 'user_suggestions', 'osm_places'],
      categoryIds: [],
      interestTagIds: [],
      searchQuery: '',
    });
  };

  const hasActiveFilters = 
    filters.categoryIds.length > 0 || 
    filters.interestTagIds.length > 0 || 
    filters.searchQuery || 
    filters.sourceTypes.length < 5;

  // Group interest tags by category
  const tagsByCategory = interestTags.reduce((acc, tag) => {
    const category = tag.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(tag);
    return acc;
  }, {} as Record<string, InterestTag[]>);

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      {/* Search Mode Toggle */}
      <div className="flex gap-2">
        <Button
          variant={isNearMeMode ? "default" : "outline"}
          className="flex-1"
          onClick={onNearMeClick}
        >
          <MapPin className="w-4 h-4 mr-2" />
          Near Me
        </Button>
        <Button
          variant={!isNearMeMode ? "default" : "outline"}
          className="flex-1"
          onClick={onExploreClick}
        >
          <Globe className="w-4 h-4 mr-2" />
          Explore
        </Button>
      </div>

      {/* Location Status */}
      {isNearMeMode && userLocation && (
        <div className="text-xs text-muted-foreground bg-muted/50 rounded-md p-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Showing results within {filters.nearLocation?.radiusKm || 50}km of your location
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search places, activities..."
          value={filters.searchQuery}
          onChange={(e) => onFiltersChange({ searchQuery: e.target.value })}
          className="pl-10"
        />
        {filters.searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => onFiltersChange({ searchQuery: '' })}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Source Type Toggles */}
      <div>
        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Show on Map
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(SOURCE_TYPE_CONFIG) as [LocationSourceType, typeof SOURCE_TYPE_CONFIG[LocationSourceType]][]).map(([type, config]) => (
            <button
              key={type}
              onClick={() => toggleSourceType(type)}
              className={`flex items-center gap-2 p-2 rounded-md border transition-all text-sm ${
                filters.sourceTypes.includes(type)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:bg-muted/50'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${config.color}`} />
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      <Collapsible open={categoriesOpen} onOpenChange={setCategoriesOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium py-2">
          <span className="flex items-center gap-2">
            Categories
            {filters.categoryIds.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {filters.categoryIds.length}
              </Badge>
            )}
          </span>
          {categoriesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ScrollArea className="h-40 mt-2">
            <div className="space-y-1">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                >
                  <Checkbox
                    checked={filters.categoryIds.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                  <span className="text-sm">{category.name}</span>
                </label>
              ))}
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>

      {/* Interest Tags */}
      <Collapsible open={interestsOpen} onOpenChange={setInterestsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium py-2">
          <span className="flex items-center gap-2">
            Interests
            {filters.interestTagIds.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {filters.interestTagIds.length}
              </Badge>
            )}
          </span>
          {interestsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ScrollArea className="h-48 mt-2">
            <div className="space-y-3">
              {Object.entries(tagsByCategory).map(([category, tags]) => (
                <div key={category}>
                  <div className="text-xs font-medium text-muted-foreground uppercase mb-1 px-2">
                    {category}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant={filters.interestTagIds.includes(tag.id) ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => toggleInterestTag(tag.id)}
                      >
                        {tag.icon && <span className="mr-1">{tag.icon}</span>}
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>

      {/* Results Count & Clear */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-sm text-muted-foreground">
          {loading ? 'Loading...' : `${locationCount} locations found`}
        </span>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
};
