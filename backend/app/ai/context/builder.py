from app.schemas.ats_score import ATSScoreResponse
from app.schemas.matching import MatchResult
from app.schemas.resume import ParsedResume

from app.ai.context.ats_context import build_ats_context
from app.ai.context.matching_context import build_matching_context
from app.ai.context.resume_context import build_resume_context


class AIContextBuilder:
    @staticmethod
    def build_analysis_context(
        resume: ParsedResume,
        ats: ATSScoreResponse,
        match: MatchResult,
    ) -> str:
        sections = [
            build_resume_context(resume),
            build_ats_context(ats),
            build_matching_context(match),
        ]

        return "\n\n".join(
            section.strip()
            for section in sections
            if section.strip()
        )