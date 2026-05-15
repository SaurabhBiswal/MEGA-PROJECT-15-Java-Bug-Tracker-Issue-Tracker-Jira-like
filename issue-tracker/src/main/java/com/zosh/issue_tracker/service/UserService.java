package com.zosh.issue_tracker.service;

import com.zosh.issue_tracker.model.User;

public interface UserService {
    User findUserByJwt(String jwt) throws Exception;

    User findUserByEmail(String email) throws Exception;

    User findUserById(Long userId) throws Exception;

    User updateUser(User user) throws Exception;
}
