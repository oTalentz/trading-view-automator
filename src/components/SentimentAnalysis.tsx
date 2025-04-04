
import React, { useEffect } from 'react';
import { useSentimentAnalysis } from '@/hooks/useSentimentAnalysis';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, RefreshCw, TrendingUp, TrendingDown, LineChart, Twitter, Newspaper, MessageCircle } from 'lucide-react';

export function SentimentAnalysis({ symbol }: { symbol: string }) {
  const { sentimentData, isLoading, getSentimentAnalysis } = useSentimentAnalysis(symbol);
  const { t } = useLanguage();
  
  useEffect(() => {
    getSentimentAnalysis();
  }, [symbol, getSentimentAnalysis]);
  
  // Função para determinar a cor com base no score
  const getSentimentColor = (score: number) => {
    if (score > 50) return "text-green-500";
    if (score > 20) return "text-green-400";
    if (score > 0) return "text-green-300";
    if (score === 0) return "text-gray-400";
    if (score > -20) return "text-red-300";
    if (score > -50) return "text-red-400";
    return "text-red-500";
  };
  
  // Função para obter o ícone de um source
  const getSourceIcon = (source: 'news' | 'twitter' | 'reddit' | 'stocktwits') => {
    switch (source) {
      case 'news':
        return <Newspaper className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'reddit':
      case 'stocktwits':
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };
  
  if (isLoading && !sentimentData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("sentimentAnalysis")}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
        </CardContent>
      </Card>
    );
  }
  
  if (!sentimentData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("sentimentAnalysis")}</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10">
          <LineChart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">{t("noSentimentData")}</h3>
          <p className="text-muted-foreground text-center max-w-md mx-auto mb-6">
            {t("noSentimentDataDescription")}
          </p>
          <Button onClick={getSentimentAnalysis} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            {t("analyzeSentiment")}
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">{t("sentimentAnalysis")}</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={getSentimentAnalysis} 
          disabled={isLoading}
          className="h-8"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">{t("marketSentiment")}</span>
            <Badge variant={sentimentData.marketImpact === 'high' ? 'destructive' : 
                          sentimentData.marketImpact === 'medium' ? 'default' : 'outline'}>
              {sentimentData.marketImpact === 'high' ? t("highImpact") : 
               sentimentData.marketImpact === 'medium' ? t("mediumImpact") : 
               sentimentData.marketImpact === 'low' ? t("lowImpact") : t("neutralImpact")}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {sentimentData.overallScore > 0 ? (
              <TrendingUp className={`h-5 w-5 ${getSentimentColor(sentimentData.overallScore)}`} />
            ) : sentimentData.overallScore < 0 ? (
              <TrendingDown className={`h-5 w-5 ${getSentimentColor(sentimentData.overallScore)}`} />
            ) : (
              <LineChart className="h-5 w-5 text-gray-400" />
            )}
            <div className={`text-2xl font-bold ${getSentimentColor(sentimentData.overallScore)}`}>
              {sentimentData.overallScore > 0 ? '+' : ''}{sentimentData.overallScore}
            </div>
          </div>
          
          <div className="mt-1 text-xs text-muted-foreground">
            {t("lastUpdated")}: {new Date(sentimentData.latestUpdate).toLocaleTimeString()}
          </div>
        </div>
        
        <Tabs defaultValue="sources">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="sources">{t("sources")}</TabsTrigger>
            <TabsTrigger value="keywords">{t("keywords")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sources">
            <ScrollArea className="h-[240px]">
              <div className="space-y-3">
                {sentimentData.sources.map((source, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1.5">
                        {getSourceIcon(source.source)}
                        <span className="text-xs font-medium capitalize">{source.source}</span>
                      </div>
                      {source.score !== undefined && (
                        <span className={`text-xs font-semibold ${getSentimentColor(source.score)}`}>
                          {source.score > 0 ? '+' : ''}{source.score}
                        </span>
                      )}
                    </div>
                    <p className="text-sm">{source.text}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-muted-foreground">
                        {new Date(source.timestamp).toLocaleTimeString()}
                      </span>
                      {source.url && (
                        <a 
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs text-blue-500 hover:underline"
                        >
                          {t("source")}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="keywords">
            <div className="h-[240px] flex flex-wrap gap-2 content-start">
              {sentimentData.keywords.map((keyword, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="px-3 py-1 text-sm font-normal"
                >
                  {keyword.word}
                  <span className="ml-1 text-xs text-muted-foreground">({keyword.count})</span>
                </Badge>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
