package com.company_finder.back.services;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.company_finder.back.models.SearchResultDTO;
import com.company_finder.back.repositories.SearchRepository;

@Service
public class SearchService {

    @Autowired
    private SearchRepository searchRepository;

    public List<SearchResultDTO> search(String keyword) {
        String formattedKeyword = "%" + keyword + "%";
        
        List<Object[]> results = searchRepository.searchGlobal(formattedKeyword);
        
        return results.stream().map(result -> 
            new SearchResultDTO(
                result[0] != null ? ((Number) result[0]).longValue() : null, // categoryId
                result[1] != null ? (String) result[1] : null,               // categoryName
                result[2] != null ? ((Number) result[2]).longValue() : null, // subcategoryId
                result[3] != null ? (String) result[3] : null,               // subcategoryName
                result[4] != null ? ((Number) result[4]).longValue() : null, // activityId
                result[5] != null ? (String) result[5] : null,               // activityName
                result[6] != null ? (String) result[6] : null                // nafCode
            )
        ).collect(Collectors.toList());
    }
}
