import { useState } from "react";
import { Search, AlertTriangle, Info, ChevronDown, ChevronUp } from "lucide-react";
import { lookupDTC, getSeverityColor, getCategoryLabel, DTCDefinition } from "../data/dtcCodes";
import { motion, AnimatePresence } from "framer-motion";

interface DTCLookupProps {
  initialCodes?: string[];
  onCodeSelect?: (code: string) => void;
}

export function DTCLookup({ initialCodes = [], onCodeSelect }: DTCLookupProps) {
  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState<Array<{ code: string; definition: DTCDefinition | null }>>(
    initialCodes.map((code) => ({ code, definition: lookupDTC(code) }))
  );
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  const handleSearch = () => {
    if (!searchInput.trim()) return;

    // Extract all potential DTC codes from input
    const codePattern = /\b[PBCU][0-9]{4}\b/gi;
    const matches = searchInput.match(codePattern);

    if (matches) {
      const uniqueCodes = [...new Set(matches.map((c) => c.toUpperCase()))];
      const newResults = uniqueCodes.map((code) => ({
        code,
        definition: lookupDTC(code),
      }));
      setResults(newResults);
    } else {
      // Try treating the whole input as a single code
      const definition = lookupDTC(searchInput);
      if (definition) {
        setResults([{ code: searchInput.toUpperCase(), definition }]);
      } else {
        setResults([{ code: searchInput.toUpperCase(), definition: null }]);
      }
    }
  };

  return (
    <div className="bg-card border rounded-xl p-4">
      <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
        <Search className="w-4 h-4 text-primary" />
        DTC Code Lookup
      </h3>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Enter code (e.g., P0420)"
          className="flex-1 px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition"
        >
          Look Up
        </button>
      </div>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {results.map(({ code, definition }) => (
              <motion.div
                key={code}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedCode(expandedCode === code ? null : code)}
                  className="w-full px-3 py-2 flex items-center justify-between hover:bg-muted/50 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-primary">{code}</span>
                    {definition ? (
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(definition.severity)}`}>
                        {definition.severity}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                        Unknown
                      </span>
                    )}
                  </div>
                  {expandedCode === code ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedCode === code && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t bg-muted/30"
                    >
                      {definition ? (
                        <div className="p-3 space-y-3 text-sm">
                          <div>
                            <p className="font-medium">{definition.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {getCategoryLabel(definition.category)}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-1">
                              Common Causes
                            </h4>
                            <ul className="list-disc list-inside space-y-0.5">
                              {definition.commonCauses.map((cause, i) => (
                                <li key={i} className="text-muted-foreground">
                                  {cause}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-1">
                              Symptoms
                            </h4>
                            <ul className="list-disc list-inside space-y-0.5">
                              {definition.symptoms.map((symptom, i) => (
                                <li key={i} className="text-muted-foreground">
                                  {symptom}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {onCodeSelect && (
                            <button
                              onClick={() => onCodeSelect(code)}
                              className="w-full mt-2 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition"
                            >
                              Ask AI about this code
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="p-3 flex items-start gap-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Code not in database</p>
                            <p className="text-muted-foreground text-xs mt-1">
                              This code isn't in our local database. Ask the AI assistant for more information about this specific code.
                            </p>
                            {onCodeSelect && (
                              <button
                                onClick={() => onCodeSelect(code)}
                                className="mt-2 px-3 py-1.5 bg-primary/10 text-primary rounded text-xs font-medium hover:bg-primary/20 transition"
                              >
                                Ask AI about {code}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {results.length === 0 && (
        <div className="text-center py-4 text-muted-foreground text-sm">
          <Info className="w-5 h-5 mx-auto mb-2 opacity-50" />
          <p>Enter a DTC code to see its definition</p>
          <p className="text-xs mt-1">Supports P, B, C, and U codes</p>
        </div>
      )}
    </div>
  );
}
