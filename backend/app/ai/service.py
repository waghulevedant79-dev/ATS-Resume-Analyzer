# from app.integrations.gemini import gemini_provider
from app.integrations.providers.manager import ai_provider
from app.ai.builders.analysis_builder import AnalysisBuilder
from app.integrations.providers.base import BaseAIProvider
from app.ai.response_parser import AIResponseParser
from app.ai.context.builder import AIContextBuilder

from app.schemas.ai import ( 
    AIAnalysisResponse, 
    ProfessionalSummaryResponse, 
    ProjectEnhancementResponse, 
    KeywordExplanationResponse, 
    RewrittenResumeResponse 
)
from app.schemas.ats_score import ATSScoreResponse
from app.schemas.matching import MatchResult
from app.schemas.parser import ParsedResume, ParsedProject

from app.ai.context.summary_context import build_summary_context
from app.ai.builders.summary_builders import SummaryBuilder
from app.ai.context.project_context import build_project_context
from app.ai.builders.project_builders import ProjectBuilder
from app.ai.context.keyword_context import build_keyword_context
from app.ai.builders.keyword_builder import KeywordExplanationBuilder
from app.ai.context.resume_rewrite_context import build_resume_rewrite_context
from app.ai.builders.resume_rewrite_builder import ResumeRewriteBuilder


class AIService:
    """
    Coordinates AI requests for the application.
    """

    def __init__(self, provider: BaseAIProvider):
        self.provider = provider
    
    """
    ✅Free Features: 
    AI resume review
    ATS suggestions
    resume tailoring
    """
    def analyze(
        self,
        resume: ParsedResume,
        ats: ATSScoreResponse,
        match: MatchResult
        ) -> AIAnalysisResponse:
        
        context = AIContextBuilder.build_analysis_context(
            resume=resume,
            ats=ats,
            match=match,
        )
        
        prompt = AnalysisBuilder.build(context)
        
        raw_response = self.provider.generate(
            prompt,
            response_schema=AIAnalysisResponse,
        )
        
        return AIResponseParser.parse_analysis(raw_response)
    
    """
    🔒Premium Features: 
    Professional Summary Generator
    Project Description Enhancer
    Missing Keyword Explanations
    """
    def generate_professional_summary(
        self,
        resume: ParsedResume,
        ) -> ProfessionalSummaryResponse:

        context = build_summary_context(
            resume
        )

        prompt = SummaryBuilder.build(
            context
        )

        raw_response = self.provider.generate(
            prompt
        )

        return AIResponseParser.parse_summary(
            raw_response
        )


    def enhance_project(
        self,
        project: ParsedProject,
        resume: ParsedResume,
    ) -> ProjectEnhancementResponse:

        context = build_project_context(
            project=project,
            resume=resume,
        )
        

        prompt = ProjectBuilder.build(
            context
        )

        raw_response = self.provider.generate(
            prompt
        )

        return AIResponseParser.parse_project_enhancement(
            raw_response
        )


    def explain_missing_keywords(
        self,
        resume: ParsedResume,
        match: MatchResult,
    ) -> KeywordExplanationResponse:

        context = build_keyword_context(
            resume=resume,
            match=match,
        )
        
        # print("\n========== KEYWORD CONTEXT ==========")
        # print(context)
        # print("=====================================\n")

        # No missing keywords = no AI request needed
        if not match.skills.missing_skills:
            return KeywordExplanationResponse(
                keyword_explanations=[]
            )

        prompt = KeywordExplanationBuilder.build(
            context
        )

        raw_response = self.provider.generate(
            prompt
        )

        return AIResponseParser.parse_keyword_explanations(
            raw_response
        )


    def rewrite_resume(
        self,
        resume: ParsedResume,
    ) -> RewrittenResumeResponse:

        context = build_resume_rewrite_context(
            resume=resume,
        )

        prompt = ResumeRewriteBuilder.build(
            context
        )

        raw_response = self.provider.generate(
            prompt
        )

        return AIResponseParser.parse_resume_rewrite(
            raw_response
        )




ai_service = AIService(ai_provider)
