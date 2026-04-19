import json
from duckduckgo_search import DDGS

class EligibilityAgent:
    """Calculates eligibility math between User Profile and DB Opportunities"""
    
    @staticmethod
    def calculate_score(user_profile: dict, opportunity: dict) -> dict:
        score = 0
        max_score = 100
        reasons = []

        # Compare State (Locality)
        if user_profile.get('state', '').lower() in opportunity.get('title_en', '').lower():
            score += 40
            reasons.append("Location matches perfectly")
        else:
            score += 10 # Baseline
        
        # Compare Qualification
        tags = str(opportunity.get('tags', '')).lower()
        if user_profile.get('qualification', '').lower() in tags:
            score += 40
            reasons.append("Educational qualification matches")
        
        # Domain match
        if user_profile.get('domain', '').lower() in tags:
            score += 20
            reasons.append("Field of study matches")
        
        final_score = min(score, max_score)
        return {"id": opportunity.get("id"), "title": opportunity.get("title_en"), "score": final_score, "reasons": reasons}

    @staticmethod
    def filter_and_rank(user_profile: dict, all_opportunities: list) -> list:
        results = []
        for opp in all_opportunities:
            evaluation = EligibilityAgent.calculate_score(user_profile, opp)
            if evaluation["score"] > 30: # Only keep somewhat relevant
                results.append(evaluation)
        
        # Sort by best score descending
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:5] # Top 5


class ResearcherAgent:
    """Searches live internet for dynamic answers not in DB"""
    
    @staticmethod
    def perform_live_search(query: str):
        try:
            results = DDGS().text(f"{query} scholarships schemes opportunities India", max_results=3)
            return [{"title": r['title'], "snippet": r['body'], "link": r['href']} for r in results]
        except Exception as e:
            print("Researcher Agent error:", e)
            return []
