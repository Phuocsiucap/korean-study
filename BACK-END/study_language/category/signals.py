from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from .models import Word, Lesson

@receiver([post_save, post_delete], sender=Word)
def update_work_learn(sender, instance, **kwargs):
    """
    Mỗi khi Word được thêm, xóa hoặc thay đổi, cập nhật lại:
    - word_count trong Lesson
    - total_words trong Category
    - wordsLearned trong User
    """
    lesson = instance.lesson
    category = lesson.category
    user = category.user

    # 1️⃣ Cập nhật số từ trong lesson hiện tại
    lesson.word_count = lesson.words.count()
    lesson.save(update_fields=["word_count"])

    # 2️⃣ Cập nhật tổng số từ trong category
    category.total_words = sum(l.words.count() for l in category.lessons.all())
    category.save(update_fields=["total_words"])
    
    # 3️⃣ Cập nhật tổng số từ đã học của user
    learned_count = Word.objects.filter(
        lesson__category__user=user, learned=True
    ).count()
    user.wordsLearned = learned_count
    

    user.save(update_fields=["wordsLearned"])


    
@receiver([post_save, post_delete], sender=Lesson)
def update_category(sender, instance, **kwargs):
    """Cập nhật số lượng bài học (lesson) trong Category khi thêm/xóa Lesson"""
    category = instance.category
    user = category.user
    category.lesson = category.lessons.count()
    completed_lesson = Lesson.objects.filter(
        category=category, completed = True
    ).count()
    category.completed = completed_lesson
    category.save()
    
   
  
@receiver([post_save, post_delete], sender=Word)
def update_category_progress(sender, instance, **kwargs):
    """Cập nhật progress khi Word thay đổi"""
    category = instance.lesson.category

    total_words = category.total_words
    completed_word = Word.objects.filter(
        lesson__category=category, learned=True
    ).count()

    if total_words > 0:
        category.progress = (completed_word / total_words) * 100
    else:
        category.progress = 0

    print(f"[Signal] Completed words: {completed_word}, Progress: {category.progress}%")
    category.save()


@receiver(pre_save, sender=Lesson)
def update_study_time(sender, instance, **kwargs):
    """
    Cập nhật thời gian học và thời gian học gần nhất.
    """
    # Nếu là bản ghi đã tồn tại (update)
    category = instance.category
    user = category.user
    if instance.pk:
        old_instance = Lesson.objects.get(pk=instance.pk)
        user.studyTime = user.studyTime - old_instance.studyTime + instance.studyTime
        user.save()
    