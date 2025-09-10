import { supabase } from '@/integrations/supabase/client';

interface ThailandDataRow {
  id: string;
  country: string;
  region: string;
  state: string;
  city: string;
  neighborhood: string;
  subregion: string;
  name: string;
  category: string;
  interest_tags: string;
  latitude: number;
  longitude: number;
  address: string;
  ticket_url?: string;
  image_url?: string;
  description_short?: string;
  dwell_time_min?: number;
  last_updated?: string;
  reference_url?: string;
}

interface ProcessedAttraction {
  name: string;
  short_description?: string;
  description?: string;
  price_from: number;
  duration_hours: number;
  rating: number;
  review_count: number;
  image_urls: string[];
  tags: string[];
  currency: string;
  address: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
  city_id?: string;
  category_id?: string;
}

export class CountryDataImporter {
  private async findOrCreateCity(cityName: string, countryName: string) {
    // First try to find existing city
    const { data: existingCity } = await supabase
      .from('cities')
      .select('id')
      .eq('name', cityName)
      .single();

    if (existingCity) {
      return existingCity.id;
    }

    // Create new city if not found
    const { data: newCity, error } = await supabase
      .from('cities')
      .insert({
        name: cityName,
        latitude: 0, // Will be updated with actual coordinates
        longitude: 0,
        timezone: 'Asia/Bangkok',
        description: `${cityName}, ${countryName}`
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating city:', error);
      return null;
    }

    return newCity?.id;
  }

  private async findOrCreateCategory(categoryName: string) {
    // Try to find existing category
    const { data: existingCategory } = await supabase
      .from('activity_categories')
      .select('id')
      .eq('name', categoryName)
      .single();

    if (existingCategory) {
      return existingCategory.id;
    }

    // Create new category
    const { data: newCategory, error } = await supabase
      .from('activity_categories')
      .insert({
        name: categoryName,
        description: `${categoryName} category`,
        icon: this.getCategoryIcon(categoryName)
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating category:', error);
      return null;
    }

    return newCategory?.id;
  }

  private getCategoryIcon(category: string): string {
    const iconMap: { [key: string]: string } = {
      'temple': '🏛️',
      'market': '🏪',
      'nature': '🌿',
      'beach': '🏖️',
      'museum': '🏛️',
      'park': '🌳',
      'shopping': '🛍️',
      'food': '🍜',
      'culture': '🎭',
      'adventure': '🎢',
      'nightlife': '🌃',
      'art': '🎨'
    };

    return iconMap[category.toLowerCase()] || '📍';
  }

  private processRow(row: ThailandDataRow): ProcessedAttraction {
    const tags = row.interest_tags ? row.interest_tags.split(',').map(tag => tag.trim()) : [];
    const imageUrls = row.image_url ? [row.image_url] : [];
    
    return {
      name: row.name,
      short_description: row.description_short,
      description: row.description_short, // Using short description for now
      price_from: 0, // Default, can be updated later
      duration_hours: Math.max(1, Math.floor((row.dwell_time_min || 60) / 60)),
      rating: 4.5, // Default rating
      review_count: Math.floor(Math.random() * 500) + 50, // Random for demo
      image_urls: imageUrls,
      tags: tags,
      currency: 'USD',
      address: row.address || `${row.neighborhood}, ${row.city}`,
      latitude: row.latitude,
      longitude: row.longitude,
      is_active: true
    };
  }

  async importAttractions(csvData: ThailandDataRow[], countryName: string = 'Thailand') {
    console.log(`Starting import of ${csvData.length} attractions...`);
    
    const attractions: any[] = [];
    
    for (const row of csvData) {
      try {
        const cityId = await this.findOrCreateCity(row.city, countryName);
        const categoryId = await this.findOrCreateCategory(row.category);
        
        const attraction = this.processRow(row);
        attraction.city_id = cityId;
        attraction.category_id = categoryId;
        
        attractions.push(attraction);
        
        // Process in batches of 50
        if (attractions.length >= 50) {
          await this.insertBatch(attractions);
          attractions.length = 0; // Clear array
        }
      } catch (error) {
        console.error(`Error processing row for ${row.name}:`, error);
      }
    }
    
    // Insert remaining attractions
    if (attractions.length > 0) {
      await this.insertBatch(attractions);
    }
    
    console.log('Import completed successfully!');
  }

  private async insertBatch(attractions: any[]) {
    const { data, error } = await supabase
      .from('activities') // Using activities table (our attractions/tours table)
      .insert(attractions);
    
    if (error) {
      console.error('Error inserting batch:', error);
      throw error;
    }
    
    console.log(`Inserted batch of ${attractions.length} attractions`);
    return data;
  }

  // Helper method to parse CSV text
  static parseCSV(csvText: string): ThailandDataRow[] {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const values = line.split(',');
        const row: any = {};
        
        headers.forEach((header, index) => {
          const value = values[index]?.trim().replace(/"/g, '');
          
          // Convert numeric fields
          if (header === 'latitude' || header === 'longitude') {
            row[header] = parseFloat(value) || 0;
          } else if (header === 'dwell_time_min') {
            row[header] = parseInt(value) || 60;
          } else {
            row[header] = value;
          }
        });
        
        return row as ThailandDataRow;
      });
  }
}

// Usage example:
export const importCountryData = async (csvFiles: string[], countryName: string = 'Thailand') => {
  const importer = new CountryDataImporter();
  
  for (const csvText of csvFiles) {
    try {
      const data = CountryDataImporter.parseCSV(csvText);
      await importer.importAttractions(data, countryName);
    } catch (error) {
      console.error('Import error:', error);
    }
  }
};

// Keep backwards compatibility
export const importThailandData = async (csvFiles: string[]) => {
  return importCountryData(csvFiles, 'Thailand');
};