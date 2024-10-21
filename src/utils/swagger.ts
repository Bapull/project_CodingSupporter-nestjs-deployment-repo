import { HttpStatus } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";

export const ApiCommonResponses = () => {
  return ApiResponse({
    status: 401,
    description: '로그인이 필요함',
    schema: {
      example: {
        message: '로그인이 필요합니다.'
      }
    }
  });
};

export const ApiErrorResponse = () => {
  return ApiResponse({
    status: 400,
    description: '요청 실패',
    schema: {
      example: {
        STATUS_CODES: HttpStatus.BAD_REQUEST,
        message: '요청을 처리하지 못했습니다.',
        error: '에러 메시지'
      }
    }
  });
};