package com.skyvoyage.dto;

import java.util.List;

public class ResponseDTO<T> {
    private boolean success;
    private String message;
    private T data;
    private int statusCode;
    private List<String> errors;

    // Constructors
    public ResponseDTO() {}

    public ResponseDTO(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.statusCode = 200;
        this.errors = List.of();
    }

    public ResponseDTO(boolean success, String message, T data, int statusCode) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
        this.errors = List.of();
    }

    public ResponseDTO(boolean success, String message, T data, int statusCode, List<String> errors) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
        this.errors = errors;
    }

    // Static factory methods
    public static <T> success(T data, String message) {
        return new ResponseDTO<>(true, message, data, 200, List.of());
    }

    public static <T> error(String message, int statusCode) {
        return new ResponseDTO<>(false, message, null, statusCode, List.of(message));
    }

    public static <T> error(String message, int statusCode, List<String> errors) {
        return new ResponseDTO<>(false, message, null, statusCode, errors);
    }

    // Getters
    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public T getData() { return data; }
    public int getStatusCode() { return statusCode; }
    public List<String> getErrors() { return errors; }

    // Setters
    public void setSuccess(boolean success) { this.success = success; }
    public void setMessage(String message) { this.message = message; }
    public void setData(T data) { this.data = data; }
    public void setStatusCode(int statusCode) { this.statusCode = statusCode; }
    public void setErrors(List<String> errors) { this.errors = errors; }
}
