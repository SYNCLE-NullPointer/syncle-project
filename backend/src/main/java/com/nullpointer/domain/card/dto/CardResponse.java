package com.nullpointer.domain.card.dto;

public class CardResponse {

    private Long id;
    private Long listId;
    private String title;
    private String description;
    private Integer orderIndex;

    public CardResponse() {
    }

    public CardResponse(Long id, Long listId, String title, String description, Integer orderIndex) {
        this.id = id;
        this.listId = listId;
        this.title = title;
        this.description = description;
        this.orderIndex = orderIndex;
    }

    public Long getId() {
        return id;
    }

    public Long getListId() {
        return listId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setListId(Long listId) {
        this.listId = listId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }
}
