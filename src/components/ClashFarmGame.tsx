import React, { useState, useEffect } from 'react';
import { Droplets, Shovel, Scissors, Sprout, Cloud, Sun, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGame, FieldTile, FieldTileType } from '@/contexts/GameContext';
import { toast } from 'sonner';

type ToolType = 'plough' | 'sow' | 'water' | 'harvest';

export const ClashFarmGame: React.FC = () => {
  const { t } = useLanguage();
  const { field, updateFieldTile, tasks, completeTask } = useGame();
  const [selectedTool, setSelectedTool] = useState<ToolType>('plough');
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  const [weatherEffect, setWeatherEffect] = useState<'sunny' | 'cloudy' | 'windy'>('sunny');

  // Weather animation cycle
  useEffect(() => {
    const weatherCycle = setInterval(() => {
      const effects: ('sunny' | 'cloudy' | 'windy')[] = ['sunny', 'cloudy', 'windy'];
      setWeatherEffect(effects[Math.floor(Math.random() * effects.length)]);
    }, 8000);

    return () => clearInterval(weatherCycle);
  }, []);

  if (!field) {
    return (
      <Card className="farming-card">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/40 rounded-lg flex items-center justify-center mx-auto animate-pulse">
              <Sprout className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">{t('addYourField')}</h3>
            <p className="text-muted-foreground max-w-sm">{t('clickToAdd')}</p>
            <div className="text-sm text-muted-foreground">
              Scan your field to create your farm!
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleTileClick = (tile: FieldTile) => {
    if (selectedTile === tile.id) {
      setSelectedTile(null);
      return;
    }

    setSelectedTile(tile.id);
    
    let newType: FieldTileType = tile.type;
    let taskCompleted = false;

    switch (selectedTool) {
      case 'plough':
        if (tile.type === 'empty') {
          newType = 'soil';
          taskCompleted = true;
        }
        break;
      case 'sow':
        if (tile.type === 'soil') {
          newType = 'planted';
          taskCompleted = true;
        }
        break;
      case 'water':
        if (tile.type === 'planted') {
          newType = 'watered';
          setTimeout(() => {
            updateFieldTile(tile.id, 'grown');
          }, 3000);
          taskCompleted = true;
        }
        break;
      case 'harvest':
        if (tile.type === 'grown') {
          newType = 'harvested';
          taskCompleted = true;
        }
        break;
    }

    if (newType !== tile.type) {
      updateFieldTile(tile.id, newType);
      
      if (taskCompleted) {
        const relatedTask = tasks.find(task => 
          !task.completed && task.type === selectedTool
        );
        
        if (relatedTask) {
          completeTask(relatedTask.id);
          toast.success(`🎉 Task completed: ${relatedTask.title}`);
        }
      }
    }
  };

  const getTileClass = (tile: FieldTile) => {
    const baseClass = 'relative w-12 h-12 rounded-lg cursor-pointer border-2 transition-all duration-300 hover:scale-105';
    const selectedClass = selectedTile === tile.id ? 'ring-2 ring-primary ring-offset-2' : '';
    
    switch (tile.type) {
      case 'empty':
        return `${baseClass} bg-gradient-to-br from-amber-200 to-amber-300 border-amber-400 ${selectedClass}`;
      case 'soil':
        return `${baseClass} bg-gradient-to-br from-amber-600 to-amber-700 border-amber-800 ${selectedClass}`;
      case 'planted':
        return `${baseClass} bg-gradient-to-br from-green-200 to-green-300 border-green-400 ${selectedClass} animate-pulse`;
      case 'watered':
        return `${baseClass} bg-gradient-to-br from-blue-200 to-green-200 border-blue-400 ${selectedClass}`;
      case 'grown':
        return `${baseClass} bg-gradient-to-br from-green-400 to-green-500 border-green-600 ${selectedClass} animate-bounce`;
      case 'harvested':
        return `${baseClass} bg-gradient-to-br from-yellow-200 to-yellow-300 border-yellow-400 ${selectedClass}`;
      default:
        return `${baseClass} bg-gradient-to-br from-gray-200 to-gray-300 border-gray-400 ${selectedClass}`;
    }
  };

  const getTileContent = (tile: FieldTile) => {
    switch (tile.type) {
      case 'soil':
        return <div className="w-2 h-2 bg-amber-800 rounded-full mx-auto"></div>;
      case 'planted':
        return <Sprout className="h-6 w-6 text-green-700 animate-pulse" />;
      case 'watered':
        return (
          <div className="flex items-center justify-center">
            <Droplets className="h-4 w-4 text-blue-600" />
            <Sprout className="h-5 w-5 text-green-600 ml-1" />
          </div>
        );
      case 'grown':
        return <div className="text-xl">🌱</div>;
      case 'harvested':
        return <div className="text-xl">✨</div>;
      default:
        return null;
    }
  };

  const getWeatherIcon = () => {
    switch (weatherEffect) {
      case 'sunny':
        return <Sun className="h-6 w-6 text-yellow-500 animate-spin-slow" />;
      case 'cloudy':
        return <Cloud className="h-6 w-6 text-gray-400 animate-float" />;
      case 'windy':
        return <Wind className="h-6 w-6 text-blue-400 animate-pulse" />;
    }
  };

  const tools = [
    { type: 'plough' as ToolType, icon: Shovel, label: 'Plough', color: 'text-amber-600', bg: 'bg-amber-100' },
    { type: 'sow' as ToolType, icon: Sprout, label: 'Plant', color: 'text-green-600', bg: 'bg-green-100' },
    { type: 'water' as ToolType, icon: Droplets, label: 'Water', color: 'text-blue-600', bg: 'bg-blue-100' },
    { type: 'harvest' as ToolType, icon: Scissors, label: 'Harvest', color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const progressStats = {
    ploughed: field.tiles.filter(t => ['soil', 'planted', 'watered', 'grown', 'harvested'].includes(t.type)).length,
    planted: field.tiles.filter(t => ['planted', 'watered', 'grown', 'harvested'].includes(t.type)).length,
    watered: field.tiles.filter(t => ['watered', 'grown', 'harvested'].includes(t.type)).length,
    harvested: field.tiles.filter(t => t.type === 'harvested').length,
    total: field.tiles.length
  };

  return (
    <Card className="farming-card overflow-hidden">
      <CardHeader className="relative">
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          {getWeatherIcon()}
          <Badge variant="outline" className="capitalize">{weatherEffect}</Badge>
        </div>
        <CardTitle className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
            <Sprout className="h-5 w-5 text-white" />
          </div>
          KrishiQuest Farm
        </CardTitle>
        <div className="flex items-center space-x-4 mt-2">
          <Badge variant="outline">
            {field.tiles.length} tiles
          </Badge>
          <Badge variant="secondary">
            Moisture: {field.moistureLevel}%
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            Progress: {Math.round((progressStats.harvested / progressStats.total) * 100)}%
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Tools */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isSelected = selectedTool === tool.type;
            return (
              <Button
                key={tool.type}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTool(tool.type)}
                className={`flex flex-col items-center h-auto py-4 transition-all duration-200 ${
                  isSelected ? 'scale-105 shadow-lg' : 'hover:scale-102'
                }`}
              >
                <div className={`p-2 rounded-lg mb-2 ${isSelected ? 'bg-white/20' : tool.bg}`}>
                  <Icon className={`h-6 w-6 ${isSelected ? 'text-white' : tool.color}`} />
                </div>
                <span className="text-xs font-medium">{tool.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Farm Progress */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">{progressStats.ploughed}</div>
            <div className="text-xs text-muted-foreground">Ploughed</div>
            <Progress value={(progressStats.ploughed / progressStats.total) * 100} className="h-2 mt-1" />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{progressStats.planted}</div>
            <div className="text-xs text-muted-foreground">Planted</div>
            <Progress value={(progressStats.planted / progressStats.total) * 100} className="h-2 mt-1" />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{progressStats.watered}</div>
            <div className="text-xs text-muted-foreground">Watered</div>
            <Progress value={(progressStats.watered / progressStats.total) * 100} className="h-2 mt-1" />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{progressStats.harvested}</div>
            <div className="text-xs text-muted-foreground">Harvested</div>
            <Progress value={(progressStats.harvested / progressStats.total) * 100} className="h-2 mt-1" />
          </div>
        </div>

        {/* Game Field */}
        <div className="relative">
          {/* Sky background with weather effects */}
          <div className={`absolute inset-0 rounded-lg transition-all duration-1000 ${
            weatherEffect === 'sunny' ? 'bg-gradient-to-b from-blue-300 to-blue-100' :
            weatherEffect === 'cloudy' ? 'bg-gradient-to-b from-gray-300 to-gray-100' :
            'bg-gradient-to-b from-blue-400 to-blue-200'
          }`}>
            {/* Animated clouds */}
            <div className="absolute top-2 left-4 animate-float">
              <div className="w-8 h-4 bg-white rounded-full opacity-70"></div>
            </div>
            <div className="absolute top-4 right-8 animate-float-delayed">
              <div className="w-6 h-3 bg-white rounded-full opacity-60"></div>
            </div>
            <div className="absolute top-3 left-1/3 animate-float-slow">
              <div className="w-10 h-5 bg-white rounded-full opacity-50"></div>
            </div>
          </div>

          {/* Farm grid */}
          <div className="relative z-10 grid grid-cols-10 gap-2 p-6 bg-gradient-to-b from-transparent to-green-100/50 rounded-lg">
            {field.tiles.map((tile) => (
              <div
                key={tile.id}
                className={getTileClass(tile)}
                onClick={() => handleTileClick(tile)}
                title={`Tile ${tile.x}-${tile.y}: ${tile.type}`}
              >
                <div className="w-full h-full flex items-center justify-center relative">
                  {getTileContent(tile)}
                  {/* Growth effect for newly planted */}
                  {tile.type === 'planted' && (
                    <div className="absolute inset-0 bg-green-200 rounded-lg animate-ping opacity-30"></div>
                  )}
                  {/* Harvest sparkle effect */}
                  {tile.type === 'harvested' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Instructions */}
          <div className="mt-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/20">
            <p className="text-sm text-foreground font-medium">
              🛠️ Selected: <span className="text-primary">{tools.find(t => t.type === selectedTool)?.label}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Follow the farming sequence: Plough the soil → Plant seeds → Water crops → Harvest when ready
            </p>
          </div>
        </div>

        {/* Field Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-primary/5 to-secondary/10 rounded-lg border border-primary/20">
            <div className="text-sm text-muted-foreground">Soil Condition</div>
            <div className="font-semibold text-primary">{field.soilCondition}</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className="text-sm text-muted-foreground">Farm Level</div>
            <div className="font-semibold text-green-700">
              Level {Math.floor(progressStats.harvested / 10) + 1}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};