import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CountryDataImporter } from '@/utils/importThailandData';

export const DataImporter = () => {
  const [csvData, setCsvData] = useState<string[]>(['', '', '']);
  const [selectedCountry, setSelectedCountry] = useState('Thailand');
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    try {
      setImporting(true);
      
      const importer = new CountryDataImporter();
      const validCsvData = csvData.filter(csv => csv.trim());
      
      if (validCsvData.length === 0) {
        toast({
          title: "No data to import",
          description: "Please paste at least one CSV dataset.",
          variant: "destructive",
        });
        return;
      }

      for (const csvText of validCsvData) {
        const data = CountryDataImporter.parseCSV(csvText);
        await importer.importAttractions(data, selectedCountry);
      }

      toast({
        title: "Import successful!",
        description: `Successfully imported data from ${validCsvData.length} CSV file(s).`,
      });
      
      // Clear the textareas after successful import
      setCsvData(['', '', '']);
      
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: "There was an error importing the data. Please check the console for details.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const updateCsvData = (index: number, value: string) => {
    const newData = [...csvData];
    newData[index] = value;
    setCsvData(newData);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Country Data Importer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Country</label>
            <select 
              value={selectedCountry} 
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="Thailand">Thailand</option>
              <option value="Japan">Japan</option>
            </select>
          </div>
          
          <p className="text-muted-foreground">
            Paste your {selectedCountry} CSV data below. Each textarea can contain one CSV dataset.
          </p>
          
          {csvData.map((csv, index) => (
            <div key={index} className="space-y-2">
              <label className="text-sm font-medium">
                CSV Dataset {index + 1}
              </label>
              <Textarea
                placeholder={`Paste CSV data ${index + 1} here...`}
                value={csv}
                onChange={(e) => updateCsvData(index, e.target.value)}
                rows={8}
                className="font-mono text-xs"
              />
            </div>
          ))}
          
          <Button 
            onClick={handleImport} 
            disabled={importing || csvData.every(csv => !csv.trim())}
            className="w-full"
          >
            {importing ? 'Importing...' : `Import ${selectedCountry} Data`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};