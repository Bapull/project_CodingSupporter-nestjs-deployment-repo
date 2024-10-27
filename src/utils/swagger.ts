import { HttpStatus } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";

export const ApiUnauthorizedResponses = () => {
  return ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '로그인이 필요함',
    schema: {
      example: {
        message: '로그인이 필요합니다.'
      }
    }
  });
};

export const ApiErrorResponse = (message: string) => {
  return ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '요청 실패',
    schema: {
      example: {
        STATUS_CODES: HttpStatus.BAD_REQUEST,
        message: '요청을 처리하지 못했습니다.',
        error: message
      }
    }
  });
};

export const ApiResponseMessage = (description: string, status: number, message: string) => {
  return ApiResponse({
    status: status,
    description: description,
    schema: {
      example: {
        message: message
      }
    }
  });
};