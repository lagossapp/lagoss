import { useRouter } from 'next/router';
import { useCallback } from 'react';
import FunctionLinks from 'lib/components/FunctionLinks';
import useFunctions from 'lib/hooks/useFunctions';
import { Card, Dot, Text, Button, EmptyState } from '@lagon/ui';
import { useI18n } from 'locales';

const FunctionsList = () => {
  const { data: functions } = useFunctions();
  const { push } = useRouter();
  const { scopedT } = useI18n();
  const t = scopedT('home');

  const navigateToFunction = useCallback(
    (functionId: string) => {
      push(`/functions/${functionId}`);
    },
    [push],
  );

  const handleLinkClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
  };

  return (
    <div className="flex gap-4 flex-col">
      {functions?.length === 0 ? (
        <EmptyState
          title={t('empty.title')}
          description={t('empty.description')}
          image="/images/functions-empty.png"
          action={
            <Button variant="primary" size="lg" href="https://docs.lagon.app/get-started" target="_blank">
              {t('empty.action')}
            </Button>
          }
        />
      ) : null}
      {functions?.map(func => (
        <Card key={func.id} clickable onClick={() => navigateToFunction(func.id)}>
          <div className="flex justify-between items-start whitespace-nowrap gap-4 relative">
            <Text size="lg">
              <Dot status="success" />
              {func.name}
            </Text>
            {func.cron === null ? (
              <FunctionLinks onClick={handleLinkClick} func={func} />
            ) : (
              <span className="text-sm text-blue-500">{t('list.cron')}</span>
            )}
          </div>
          <Text size="sm">
            {t('list.lastUpdate')}&nbsp;
            {new Date(func.updatedAt).toLocaleString('en-US', {
              minute: 'numeric',
              hour: 'numeric',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </Card>
      ))}
    </div>
  );
};

export default FunctionsList;
