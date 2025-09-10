import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface VocabularyItem {
  id: string;
  word: string;
  phonetic: string;
  translation: string;
  category: string;
}

interface DragDropLessonProps {
  language: string;
  lessonTitle: string;
  vocabularyItems: VocabularyItem[];
  targetSentence: string;
  targetPhonetic: string;
  targetTranslation: string;
  onComplete: () => void;
}

interface SortableItemProps {
  id: string;
  word: string;
  phonetic: string;
  translation: string;
  category: string;
}

function SortableItem({ id, word, phonetic, translation, category }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 bg-white rounded-lg shadow-sm border-2 border-primary/20 cursor-grab active:cursor-grabbing hover:border-primary/40 transition-all ${
        isDragging ? 'opacity-50 shadow-lg' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="font-medium text-foreground">{word}</div>
          <div className="text-sm text-muted-foreground">{phonetic}</div>
          <div className="text-xs text-muted-foreground">{translation}</div>
        </div>
        <Badge variant="secondary" className="ml-2">{category}</Badge>
      </div>
    </div>
  );
}

export function DragDropLesson({
  language,
  lessonTitle,
  vocabularyItems,
  targetSentence,
  targetPhonetic,
  targetTranslation,
  onComplete,
}: DragDropLessonProps) {
  const [items, setItems] = useState(vocabularyItems);
  const [userSentence, setUserSentence] = useState<VocabularyItem[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // If dropping in sentence area
    if (overId === 'sentence-area') {
      const draggedItem = items.find(item => item.id === activeId);
      if (draggedItem && !userSentence.find(item => item.id === activeId)) {
        setUserSentence([...userSentence, draggedItem]);
      }
      return;
    }

    // If reordering within items or sentence
    if (active.id !== over.id) {
      const isActiveInSentence = userSentence.find(item => item.id === activeId);
      const isOverInSentence = userSentence.find(item => item.id === overId);

      if (isActiveInSentence && isOverInSentence) {
        // Reorder within sentence
        const oldIndex = userSentence.findIndex(item => item.id === activeId);
        const newIndex = userSentence.findIndex(item => item.id === overId);
        setUserSentence(arrayMove(userSentence, oldIndex, newIndex));
      } else if (!isActiveInSentence && !isOverInSentence) {
        // Reorder within vocabulary items
        const oldIndex = items.findIndex(item => item.id === activeId);
        const newIndex = items.findIndex(item => item.id === overId);
        setItems(arrayMove(items, oldIndex, newIndex));
      }
    }
  }

  const removeFromSentence = (id: string) => {
    setUserSentence(userSentence.filter(item => item.id !== id));
  };

  const checkAnswer = () => {
    const userWords = userSentence.map(item => item.word).join(' ');
    const correct = userWords.toLowerCase() === targetSentence.toLowerCase();
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      toast.success("Excellent! Perfect sentence construction!");
      setTimeout(() => {
        onComplete();
      }, 2000);
    } else {
      toast.error("Not quite right. Try again!");
    }
  };

  const resetLesson = () => {
    setUserSentence([]);
    setShowResult(false);
    setIsCorrect(false);
  };

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      // Set language based on the lesson language
      const langCodes: { [key: string]: string } = {
        'Spanish': 'es-ES',
        'French': 'fr-FR',
        'Japanese': 'ja-JP',
        'Chinese': 'zh-CN',
        'Italian': 'it-IT',
        'Portuguese': 'pt-PT',
        'German': 'de-DE',
        'Hindi': 'hi-IN',
        'Arabic': 'ar-SA',
        'Thai': 'th-TH'
      };
      utterance.lang = langCodes[language] || 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{lessonTitle}</span>
          <Badge variant="outline">{language}</Badge>
        </CardTitle>
        <div className="space-y-2">
          <div className="p-3 bg-secondary/50 rounded-lg">
            <p className="font-medium">Target Sentence:</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg">{targetSentence}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => playAudio(targetSentence)}
                className="h-8 w-8 p-0"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{targetPhonetic}</p>
            <p className="text-sm text-muted-foreground">{targetTranslation}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {/* Vocabulary Items */}
          <div>
            <h3 className="font-medium mb-3">Vocabulary Words:</h3>
            <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {items.map((item) => (
                  <SortableItem
                    key={item.id}
                    id={item.id}
                    word={item.word}
                    phonetic={item.phonetic}
                    translation={item.translation}
                    category={item.category}
                  />
                ))}
              </div>
            </SortableContext>
          </div>

          {/* Sentence Construction Area */}
          <div>
            <h3 className="font-medium mb-3">Construct your sentence:</h3>
            <div
              id="sentence-area"
              className="min-h-24 p-4 border-2 border-dashed border-primary/30 rounded-lg bg-secondary/20 flex flex-wrap gap-2 items-center"
            >
              {userSentence.length === 0 && (
                <p className="text-muted-foreground italic">Drag words here to build your sentence...</p>
              )}
              {userSentence.map((item, index) => (
                <div
                  key={`${item.id}-sentence-${index}`}
                  className="flex items-center gap-1 p-2 bg-primary/10 rounded border"
                >
                  <span className="font-medium">{item.word}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFromSentence(item.id)}
                    className="h-6 w-6 p-0 hover:bg-destructive/20"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DndContext>

        {/* User's constructed sentence with phonetics */}
        {userSentence.length > 0 && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="font-medium">Your sentence:</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg">{userSentence.map(item => item.word).join(' ')}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => playAudio(userSentence.map(item => item.word).join(' '))}
                className="h-8 w-8 p-0"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {userSentence.map(item => item.phonetic).join(' ')}
            </p>
          </div>
        )}

        {/* Result */}
        {showResult && (
          <div className={`p-4 rounded-lg flex items-center gap-3 ${
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className={`p-2 rounded-full ${
              isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {isCorrect ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </div>
            <div className="flex-1">
              <p className={`font-medium ${
                isCorrect ? 'text-green-800' : 'text-red-800'
              }`}>
                {isCorrect ? 'Perfect!' : 'Try again!'}
              </p>
              <p className={`text-sm ${
                isCorrect ? 'text-green-600' : 'text-red-600'
              }`}>
                {isCorrect 
                  ? 'You constructed the sentence correctly!' 
                  : 'Check the word order and try again.'
                }
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <Button
            onClick={checkAnswer}
            disabled={userSentence.length === 0}
            className="px-8"
          >
            Check Answer
          </Button>
          <Button
            onClick={resetLesson}
            variant="outline"
            className="px-8"
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}