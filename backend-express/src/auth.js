import "dotenv/config";
import jwt from "jsonwebtoken";
import { ApiError } from "./errors.js";
import { findPublic } from "./users.js";

const secretHex = process.env.JWT_SECRET ?? "";

if (!/^[0-9a-fA-F]{64}$/.test(secretHex)) {
  throw new Error("JWT_SECRET은 64자리 16진수여야 합니다.");
}

const secret = Buffer.from(secretHex, "hex");
const ttl = Number(process.env.TOKEN_TTL ?? 90);

if (!Number.isSafeInteger(ttl) || ttl <= 0) {
  throw new Error("TOKEN_TTL은 양의 정수여야 합니다.");
}

export function issueToken(user) {
  return jwt.sign(
    { sub: String(user.id) },
    secret,
    {
      algorithm: "HS256",
      expiresIn: ttl,
      issuer: process.env.JWT_ISSUER || "webservice-class",
      audience: process.env.JWT_AUDIENCE || "board-api",
    }
  );
}
export function currentUserId(req) {
  const authorization = req.headers.authorization;

  // 1. Authorization 헤더 확인
  if (!authorization || !/^Bearer [^\s]+$/i.test(authorization)) {
    throw new ApiError(401, "TOKEN_REQUIRED", "Bearer 토큰이 필요합니다.");
  }

  // 2. Bearer 뒤의 JWT 추출
  const token = authorization.split(" ")[1];

  let payload;

  // 3. JWT 서명, 알고리즘, 만료, 발급자, 사용 대상 검증
  try {
    payload = jwt.verify(token, secret, {
      algorithms: ["HS256"],
      issuer: process.env.JWT_ISSUER || "webservice-class",
      audience: process.env.JWT_AUDIENCE || "board-api",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "TOKEN_EXPIRED", "토큰이 만료되었습니다.");
    }
    throw new ApiError(401, "INVALID_TOKEN", "유효하지 않은 토큰입니다.");
  }

  // 4. 필수 클레임과 사용자 ID 검증
  if (
    !payload ||
    typeof payload !== "object" ||
    !Number.isSafeInteger(payload.exp) ||
    typeof payload.sub !== "string" ||
    !/^[1-9]\d*$/.test(payload.sub) ||
    !Number.isSafeInteger(Number(payload.sub))
  ) {
    throw new ApiError(401, "INVALID_TOKEN", "토큰 정보가 올바르지 않습니다.");
  }

  // 5. 실제 사용자 존재 여부 확인
  const userId = Number(payload.sub);

  if (!findPublic(userId)) {
    throw new ApiError(401, "INVALID_TOKEN", "존재하지 않는 사용자입니다.");
  }

  return userId;
}

export function assertOwner(userId, authorId) {
  if (userId !== authorId) {
    throw new ApiError(
      403,
      "FORBIDDEN",
      "본인이 작성한 게시글만 수정하거나 삭제할 수 있습니다."
    );
  }
}
